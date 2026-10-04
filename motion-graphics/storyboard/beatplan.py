import io, contextlib, re, json
src=open('build.py').read()
with contextlib.redirect_stdout(io.StringIO()):
    g={'__file__':'build.py'}; exec(src,g)
CH=g['CH']; tc=g['tc']; FILES=json.load(open('files.json'))
def cue(v):
    w=v.split()
    return (' '.join(w[:11])+(' …' if len(w)>11 else '')) if v else '(no voiceover)'
out=['## Beat plan','','Every line of the final script in order, with what goes on screen. Times are estimates; slide them to the radio cut. Core = in the core cut. Optional = use only if the section drags, otherwise stay on Rathan. The full lines are in the script document.','']
for n,ch in enumerate(CH,1):
    out += [f'### {n:02d} · {ch["title"]} ({tc(ch["start"])}–{tc(ch["end"])})','','| Time | Line | On screen | Use |','| --- | --- | --- | --- |']
    for b in ch['beats']:
        parts=[f'`{FILES.get(i,i)}`' for i in b['mg']]
        for k,t in b['layers']:
            if k=='real':
                t=re.sub(r'^A\d+\s+','',t); parts.append('Footage: '+t[0].lower()+t[1:])
            elif k=='ai': parts.append('AI: '+t[0].lower()+t[1:])
        if b['alt']: parts.append('Alt: '+', '.join(f'`{a}`' for a in b['alt']))
        use='Core' if b['core'] else ('Optional' if b['mg'] else ('AI shot' if any(k=='ai' for k,_ in b['layers']) else 'Footage'))
        c=lambda s: s.replace('|','/')
        out.append(f'| {tc(b["start"])} | {c(cue(b["vo"]))} | {c("; ".join(parts))} | {use} |')
    out.append('')
open('beatplan.md','w').write('\n'.join(out))
