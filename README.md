

# Ekalang

Ekalang is a simple programming language that can be interpreted during the development phase and then compiled into C. Its goal is to make small programs in C without problems of pointers or memory and without having to recompile each time the program. 

### You can start testing the language on the [online IDE](https://ide.ekazuki.fr)

This repository contains:
 - [X] the compiler (transpiler) library written in js with typescript 
 - [X] The __online IDE / playground__ to test code without downloading the CLI
 - [ ] The VSCode extension to get the syntaxic coloration
 - [ ] The CLI of the compiler

## Example

Print every number between 0 to 10

```
init int index
affect index 0
print string "Looping from 0 to 10"
while LE index 10
 print int index
 affect index ADD 1 index
end
```

## Functionality 

Current features
- Basic types (integer, boolean, string)
- Variable creation/affectation
- Numerical/Boolean operations
- Numerical comparaisons
- Flow control while, if/else

Next features to be implemented
- Read user input
- Functions
- Array
- Data structure
