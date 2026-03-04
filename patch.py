with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

target = """            <>
              <MicroLabel>Intelligence Console</MicroLabel>
              <Spacer size="s" />
              <H1>Ask about a real relationship or situation in your life.</H1>
              <Spacer size="m" />
              <Body>DEFRAG analyzes relational dynamics through your natal structure.</Body>
            </>"""

replacement = """            <>
              <MicroLabel>Intelligence Console</MicroLabel>
              <Spacer size="s" />
              <H1>Ask about a real relationship or situation in your life.</H1>
              <Spacer size="m" />
              <Body>DEFRAG analyzes relational dynamics through your natal structure.</Body>

              <Spacer size="xl" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Why doesn't my mom understand when I need space?",
                  "Why does my dad push me so hard to succeed?",
                  "Why do people expect me to carry the emotional weight in relationships?",
                  "Why do I feel responsible for fixing other people's problems?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left p-4 border border-white/10 hover:border-white/40 transition-colors duration-200 bg-black group"
                  >
                    <Body className="text-white/70 group-hover:text-white transition-colors duration-200">
                      "{suggestion}"
                    </Body>
                  </button>
                ))}
              </div>
            </>"""

content = content.replace(target, replacement)

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)
