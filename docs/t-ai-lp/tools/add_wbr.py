"""t-ai/index.html の日本語に、文節の切れ目の折り返し位置（<wbr>）を入れる。

見出し・大きい文字は `word-break: keep-all` なので、日本語は <wbr> と句読点の位置でしか折り返さない（本文はふつうに折り返す）。
これで「持ちませ／ん。」のような、単語の途中で切れる改行を防ぐ。

区切りの決め方（簡易版の文節分け）：
- 「、」「。」「？」「！」「」」「）」「…」の後ろ
- ひらがなの直後に、漢字・カタカナ・英数字・「（ が来る位置
  例：その｜全部が、｜数字の｜前では｜何の｜根拠も｜持ちません。

文言を直したら、リポジトリのルートでもう一度実行する（前に入れた <wbr> は消してから入れ直すので、何度実行してもよい）：
    python -X utf8 docs/t-ai-lp/tools/add_wbr.py
"""
import re
import sys

PATH = sys.argv[1] if len(sys.argv) > 1 else 't-ai/index.html'

HIRA = 'ぁ-ゟ'
KANJI = '一-鿿々'
PARTICLES = 'のはがをにでともへや'
# 「、」「。」などの後ろ。ただし「」）』】」の直後がひらがな（「何となく」で…）なら区切らない
AFTER_PUNCT = re.compile(rf'([、。？！…]|[」）』】](?![{HIRA}]))(?=[^\s<、。？！」）』】…])')
PHRASE = re.compile(rf'([{HIRA}])(?=[{KANJI}゠-ヿA-Za-z0-9０-９Ａ-Ｚａ-ｚ「（『【])')


def _phrase(m: re.Match) -> str:
    s, i = m.string, m.start()
    # 漢字＋送りがな1文字＋漢字（買い目・組み合わせ・切り取り）は熟語の途中なので区切らない。助詞（何の根拠）は区切る
    if i >= 1 and re.match(rf'[{KANJI}]', s[i - 1]) and re.match(rf'[{KANJI}]', s[m.end():m.end() + 1] or ' ') \
            and m.group(1) not in PARTICLES:
        return m.group(1)
    return m.group(1) + '<wbr>'


def add(text: str) -> str:
    if re.search(r'[぀-ヿ一-鿿]', text):
        text = AFTER_PUNCT.sub(r'\1<wbr>', text)
        text = PHRASE.sub(_phrase, text)
    # 「T-AI」はハイフンの所で2行に割れないようにする（CSS の .nb { white-space: nowrap }）
    return text.replace('T-AI', '<span class="nb">T-AI</span>')


src = open(PATH, encoding='utf-8').read()
head_end = src.index('<body')
head, body = src[:head_end], src[head_end:]
body = body.replace('<wbr>', '').replace('<span class="nb">T-AI</span>', 'T-AI')

out = []
skip = None  # script / style の中は触らない
for part in re.split(r'(<[^>]+>)', body):
    if part.startswith('<'):
        m = re.match(r'<(/?)(script|style)\b', part, re.I)
        if m:
            skip = None if m.group(1) else m.group(2).lower()
        out.append(part)
    elif skip:
        out.append(part)
    else:
        out.append(add(part))

open(PATH, 'w', encoding='utf-8').write(head + ''.join(out))
print(f'{PATH}: <wbr> {"".join(out).count("<wbr>")} か所')
