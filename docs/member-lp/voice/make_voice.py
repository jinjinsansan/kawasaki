"""会員LPの朗読音声を作る（ElevenLabs）。

python -X utf8 docs/member-lp/voice/make_voice.py gen     # 段落ごとに声を作る（作り済みの段落は飛ばす）
python -X utf8 docs/member-lp/voice/make_voice.py check   # 文字起こしして読み原稿と照らし合わせる → _check.txt
python -X utf8 docs/member-lp/voice/make_voice.py join    # 章ごとにつないで member/assets/voice/*.mp3 に書き出す
python -X utf8 docs/member-lp/voice/make_voice.py redo 2-5   # 2章の5段落目だけ作り直す（読み間違いの直し）

キーは環境変数 ELEVENLABS_API_KEY_STAR（表示しない・リポジトリに入れない）。
読み原稿は yomi.txt。段落の文字を変えると、その段落だけ作り直される。
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request

import pykakasi
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
CHUNKS = os.path.join(HERE, '_chunks')
OUT = os.path.join(ROOT, 'member', 'assets', 'voice')
VOICE = 'ETXjMrhy5NZL6i4w0V3W'  # Gen – Calm Japanese Narration Voice（落ち着いた男性）
MODEL = 'eleven_v3'
KEY = os.environ['ELEVENLABS_API_KEY_STAR']
GAP, GAP_TITLE = 0.6, 1.2  # 段落の間・見出しの後の間（秒）


def load():
    """章 → 段落の並び。段落は {text, title, anchor}、絵などを見せる間は {pause, anchor}。
    目印（anchor）は、その段落を読んでいる間に表示する画面（a.js が画面を探す）。"""
    chs, cur = [], None
    for block in re.split(r'\n\s*\n', open(os.path.join(HERE, 'yomi.txt'), encoding='utf-8').read()):
        lines = [l for l in block.strip().splitlines() if not l.startswith('# ')]
        if not lines:
            continue
        if lines[0].startswith('## '):
            _, n, name = lines[0].split()
            cur = {'n': int(n), 'name': name, 'paras': []}
            chs.append(cur)
            lines = lines[1:]
            if not lines:
                continue
        anchor = None
        if lines[0].startswith('@'):
            anchor = lines[0][1:]
            lines = lines[1:]
        if not lines:  # 「@目印 秒数」だけの段落＝声のない間
            a, sec = anchor.rsplit(' ', 1)
            cur['paras'].append({'pause': float(sec), 'anchor': a})
            continue
        text = '\n'.join(lines)
        assert '@' not in text, text
        cur['paras'].append({'text': text.lstrip('!'), 'title': text.startswith('!'), 'anchor': anchor})
    for ch in chs:
        for p in ch['paras']:
            if 'text' in p:
                h = hashlib.sha1(f"{VOICE}|{MODEL}|{p['text']}".encode()).hexdigest()[:10]
                p['file'] = os.path.join(CHUNKS, f"{ch['n']}-{h}.mp3")
    return chs


def tts(text, out):
    body = {'text': text, 'model_id': MODEL, 'language_code': 'ja', 'voice_settings': {'stability': 0.5}}
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
        data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    data = urllib.request.urlopen(req, timeout=300).read()
    open(out, 'wb').write(data)


def stt(path):
    r = requests.post('https://api.elevenlabs.io/v1/speech-to-text', headers={'xi-api-key': KEY},
                      data={'model_id': 'scribe_v1', 'language_code': 'jpn', 'tag_audio_events': 'false'},
                      files={'file': open(path, 'rb')}, timeout=300)
    r.raise_for_status()
    return r.json()['text']


KK = pykakasi.kakasi()


def kana(s):
    s = re.sub(r'[\s、。，．！？!?「」『』【】（）()・ー―…〜~,.:：]', '', s)
    s = ''.join(x['hira'] for x in KK.convert(s))
    return s.replace('ー', '')


def gen(chs, only=None):
    os.makedirs(CHUNKS, exist_ok=True)
    for ch in chs:
        for i, p in enumerate(ch['paras']):
            if 'text' not in p:
                continue
            if only and (ch['n'], i) != only:
                continue
            if os.path.exists(p['file']) and not only:
                continue
            print('gen', ch['n'], i, p['text'][:24])
            tts(p['text'], p['file'])


def check(chs):
    import difflib
    rows = []
    for ch in chs:
        for i, p in enumerate(ch['paras']):
            if 'text' not in p:
                continue
            cache = p['file'] + '.txt'
            if not os.path.exists(cache):
                open(cache, 'w', encoding='utf-8').write(stt(p['file']))
            heard = open(cache, encoding='utf-8').read()
            a, b = kana(p['text']), kana(heard)
            ratio = difflib.SequenceMatcher(None, a, b).ratio()
            diffs = [f"  原稿「{a[i1:i2]}」→ 聞こえ「{b[j1:j2]}」"
                     for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes() if op != 'equal']
            rows.append((ratio, f"[{ch['n']}-{i}] 一致 {ratio:.3f}\n  読み原稿: {p['text']}\n  文字起こし: {heard}\n" + '\n'.join(diffs)))
    rows.sort(key=lambda r: r[0])
    open(os.path.join(HERE, '_check.txt'), 'w', encoding='utf-8').write('\n\n'.join(r[1] for r in rows))
    print('lowest:', ', '.join(f'{r[0]:.3f}' for r in rows[:8]))


def dur(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f],
                                capture_output=True, text=True).stdout)


def silence(sec):
    f = os.path.join(CHUNKS, f'_sil{sec:.2f}.wav')
    if not os.path.exists(f):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
                        '-t', f'{sec:.2f}', f], check=True)
    return f


def join(chs):
    """章ごとに1本の mp3 にし、段落ごとの開始秒を timeline.json に書く（画面送りに使う）。
    いったん wav にそろえてからつなぐので、つなぎ目の秒数がずれない。"""
    os.makedirs(OUT, exist_ok=True)
    timeline = []
    for ch in chs:
        parts, marks, t = [], [], 0.0
        for k, p in enumerate(ch['paras']):
            if p.get('anchor'):
                marks.append([round(t, 2), p['anchor']])
            if 'pause' in p:
                f = silence(p['pause'])
            else:
                f = p['file'][:-4] + '.wav'
                if not os.path.exists(f):
                    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p['file'], '-ac', '1', '-ar', '44100', f], check=True)
            parts.append(f)
            t += dur(f)
            if 'text' in p and k < len(ch['paras']) - 1:
                g = silence(GAP_TITLE if p['title'] else GAP)
                parts.append(g)
                t += dur(g)
        lst = os.path.join(CHUNKS, '_list.txt')
        open(lst, 'w', encoding='utf-8').write(''.join(f"file '{f.replace(os.sep, '/')}'\n" for f in parts))
        out = os.path.join(OUT, f"{ch['name']}.mp3")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst,
                        '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100',
                        '-c:a', 'libmp3lame', '-b:a', '64k', out], check=True)
        d = dur(out)
        v = hashlib.md5(open(out, 'rb').read()).hexdigest()[:8]  # 作り直したら URL が変わる（古いキャッシュを使わせない）
        timeline.append({'src': f"assets/voice/{ch['name']}.mp3?v={v}", 'dur': round(d, 2), 'marks': marks})
        print(ch['name'], f'{d:.1f}s (計算 {t:.1f}s)', os.path.getsize(out) // 1024, 'KB')
    json.dump(timeline, open(os.path.join(OUT, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    chs = load()
    cmd = sys.argv[1]
    if cmd == 'gen':
        gen(chs)
    elif cmd == 'redo':
        c, i = map(int, sys.argv[2].split('-'))
        gen(chs, (c, i))
        f = [p for ch in chs if ch['n'] == c for p in ch['paras']][i]['file']
        for x in (f + '.txt', f[:-4] + '.wav'):
            if os.path.exists(x):
                os.remove(x)
    elif cmd == 'check':
        check(chs)
    elif cmd == 'join':
        join(chs)
