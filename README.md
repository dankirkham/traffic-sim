# Traffic Simulator

A WebGL 3D city traffic simulator written in TypeScript. See **Traffic Simulator** in action [here](https://dankirkham.github.io/traffic-sim/).

## About
This is a browser-based traffic simulator. Citizens live in a procedurally generated city and commute between home and work in cars. Cars have simple rules and act as automata. The goal is to not to program the concept of 'traffic' into the simulator, but rather to watch it form naturally based on many other things, such as city population, car automaton rules, and road count/topology.

Homes are red the buildings and offices are the blue buildings.

The camera can be moved using the WASD or arrow keys, rotated by holding the left mouse button and moving the mouse, and zoomed by using the scroll wheel.

## Building
```
npm install
gulp
```

Open `dist/index.html` in browser.

## Acknowledgements
Citizen name generation algorithm comes from [jacob-swanson/kerbonaut-naming](https://github.com/jacob-swanson/kerbonaut-naming).
