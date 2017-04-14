# Traffic Simulator

by Dan Kirkham

See **Traffic Simulator** in action [here](http://d4n.nl/traffic-sim/)!

WebGL city traffic simulator written in TypeScript. Citizens live in a procedurally generated city and commute between home and work in cars. Cars have simple rules and act as automata. The goal is to not to program the concept of 'traffic' into the simulator, but rather to watch it form naturally based on many other things, such as city population, car automaton rules, and road size, count, and topology.

## Building
```
npm install
gulp
```

Open `dist/index.html` in browser.

## Acknowledgements
Citizen name generation algorithm comes from [jacob-swanson/kerbonaut-naming](https://github.com/jacob-swanson/kerbonaut-naming).
