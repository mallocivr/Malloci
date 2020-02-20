let md = "# Test Space\n\
\n\
This is a test document for the Malloci MD to AFrame parser. A lot of this will be random text.\n\
\n\
## Room 1\n\
\n\
Each room is denoted using hashtags, one hastage defines the \"building\", two generates a room, n+2 generates an additional room.\n\
\n\
## Room 2\n\
\n\
The size of a room is modified by the amount of content within it's markdown section. \n\
\n\
## Room 3\n\
\n\
Here is a room with subsections\n\
\n\
### Subsection 1\n\
\n\
### Subsection 2\n\
\n\
## Room 4\n\
\n\
## Room 4\n\
\n\
## Room 4\n\
\n\
## Room 4\n\ "

const museum = new Malloci(md, 15)

//museum.SpiralMuseum(30)
museum.SquareMuseum()