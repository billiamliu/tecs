// NOTE infinite loop test
//  @SCREEN
//  D=A
//(LOOP)
//  A=D
//  M=-1
//  D=A+1
//  @LOOP
//  0;JMP

  @24575
  D=A
  @max_screen
  M=D

  @SCREEN // 16384
  D=A
  @pointer
  M=D

(LOOP)
  @KBD // 24576
  D=M
  @UNFILL
  D;JEQ // if no keyboard, unfill
  @FILL
  0;JMP // else fill

(UNFILL)
  @pointer
  A=M
  M=0
  @TILLBAKA
  0;JMP

(FILL)
  @pointer
  A=M
  M=-1
  @FRAMOAT
  0;JMP

(FRAMOAT)
  @pointer
  D=M
  @max_screen
  D=D-A
  @LOOP
  D;JEQ

  @pointer
  D=M
  D=D+1
  M=D
  @LOOP
  0;JMP

(TILLBAKA)
  @pointer
  D=M
  @SCREEN
  D=D-A
  @LOOP
  D;JEQ

  @pointer
  D=M
  D=D-1
  M=D
  @LOOP
  0;JMP
