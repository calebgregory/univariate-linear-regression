```
    _   _   _   _              __     __     _       ____                   _       _____  U _____ u
 U |"|u| | | \ |"|       ___   \ \   /"/uU  /"\  uU |  _"\ u     ___    U  /"\  u  |_ " _| \| ___"|/
  \| |\| |<|  \| |>     |_"_|   \ \ / //  \/ _ \/  \| |_) |/    |_"_|    \/ _ \/     | |    |  _|"
   | |_| |U| |\  |u      | |    /\ V /_,-./ ___ \   |  _ <       | |     / ___ \    /| |\   | |___
  <<\___/  |_| \_|     U/| |\u U  \_/-(_//_/   \_\  |_| \_\    U/| |\u  /_/   \_\  u |_|U   |_____|
 (__) )(   ||   \\,-.-,_|___|_,-.//       \\    >>  //   \\_.-,_|___|_,-.\\    >>  _// \\_  <<   >>
      (__)  (_")  (_/ \_)-' '-(_/(__)     (__)  (__)(__)  (__)\_)-' '-(_/(__)  (__)(__) (__)(__) (__)
                        _                  _   _   U _____ u    _       ____
                       |"|        ___     | \ |"|  \| ___"|/U  /"\  uU |  _"\ u
                     U | | u     |_"_|   <|  \| |>  |  _|"   \/ _ \/  \| |_) |/
                      \| |/__     | |    U| |\  |u  | |___   / ___ \   |  _ <
                       |_____|  U/| |\u   |_| \_|   |_____| /_/   \_\  |_| \_\
                       //  \\.-,_|___|_,-.||   \\,-.<<   >>  \\    >>  //   \\_
                      (_")("_)\_)-' '-(_/ (_")  (_/(__) (__)(__)  (__)(__)  (__)
     ____    U _____ u   ____     ____    U _____ u ____    ____                U  ___ u  _   _
  U |  _"\ u \| ___"|/U /"___|uU |  _"\ u \| ___"|// __"| u/ __"| u      ___     \/"_ \/ | \ |"|
   \| |_) |/  |  _|"  \| |  _ / \| |_) |/  |  _|" <\___ \/<\___ \/      |_"_|    | | | |<|  \| |>
    |  _ <    | |___   | |_| |   |  _ <    | |___  u___) | u___) |       | | .-,_| |_| |U| |\  |u
    |_| \_\   |_____|   \____|   |_| \_\   |_____| |____/>>|____/>>    U/| |\u\_)-\___/  |_| \_|
    //   \\_  <<   >>   _)(|_    //   \\_  <<   >>  )(  (__))(  (__).-,_|___|_,-.  \\    ||   \\,-.
   (__)  (__)(__) (__) (__)__)  (__)  (__)(__) (__)(__)    (__)      \_)-' '-(_/  (__)   (_")  (_/
```

## Visit

View the page at CNAME

## Accomplished Goals

For this project, I wanted to

- Implement a machine learning strategy using JavaScript, and
- Gain a familiarity with [D3.js](http://d3js.org)

The final result uses for-loops to do the linear algebraic operations for
gradient descent on several given sample data sets and randomly
generated data. These data are visually represented as points on a
two-dimensional graph and their trend line is calculated and drawn in
the browser. I also have given the user the ability to select initial
values for theta_0 and theta_1, as well as the learning rate so they can
play with different values to see how they affect the number of
iterations required to learn and the accuracy of the trend line.

## Desired Features

### On-click generation of datum

Currently the data added by a user is generated randomly. This is poor
for demonstrating a univariate linear regression model because the
trends univariate linear regression model are not random - visually
graphed, they resemble upward or downward lines.

A better alternative is to generate new datum on-click as the user
clicks the graph. In order for this to happen, the graph needs also to
be a `<canvas>` (currently it is only an `<svg>` element with several
attributes).

## Issues

As stated, this implementation of gradient descent uses for-loops on
arrays and arrays within arrays (otherwise represented by matrices).
Because of this, the code is _not_ fast.

## License

The MIT License (MIT)

Copyright (c) 2015 Caleb Gregory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
