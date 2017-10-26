// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
  @R2 // init R2 to 0
  M=0

  @R1 // get R1 to use as counter
  D=M
  @R3 // save counter to R3
  M=D
(LOOP)
  @R3
  D=M
  @END
  D;JEQ // if counter is zero, END

  @R2
  D=M
  @R0
  D=D+M
  
  @R2 // save to R2
  M=D

  @R3 // decrement counter
  D=M-1
  M=D

  @LOOP
  0;JMP
(END)
  @END
  0;JMP
