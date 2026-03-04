with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

target = """                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left p-4 border border-white/10 hover:border-white/40 transition-colors duration-200 bg-black group"
                  >
                    <Body className="text-white/70 group-hover:text-white transition-colors duration-200">
                      "{suggestion}"
                    </Body>
                  </button>"""

replacement = """                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left p-5 border border-white/10 hover:border-white/40 transition-colors duration-200 bg-black group"
                  >
                    <p className="text-[14px] leading-[1.6] text-white/50 group-hover:text-white/80 transition-colors duration-200">
                      "{suggestion}"
                    </p>
                  </button>"""

content = content.replace(target, replacement)

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)
