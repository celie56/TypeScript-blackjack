# Hey, sorry about the messy Makefile (but it works for me...)
# The TypeScript compiler should point to wherever you installed
# 	your compiler to
# As I wanted to put everthing in one javascript file
# 	that's what the output file is
# In order to test via command line, I have the ui compiling seperately

# This compile requires the most recent TypeScript compiler because
# of syntax changes, mostly the ability to do -o
TypeScriptCompiler:= tsc
output:= blackjack.js
input:= deck.ts player.ts main.ts 
ui:= ui.ts

all:
	$(TypeScriptCompiler) $(input) $(ui) --out $(output)

no-ui:
	$(TypeScriptCompiler) $(input) --out $(output)

run:
	nodejs $(output)
