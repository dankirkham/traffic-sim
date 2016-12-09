"use strict";
var building_1 = require("../elements/building");
var point_1 = require("../elements/point");
var way_1 = require("../elements/way");
var intersection_1 = require("../elements/intersection");
var map_1 = require("../elements/map");
var INTERSECTION_DISTANCE = 15;
var BUILDING_DISTANCE = 25;
var WAY_MAX_DISTANCE = 20;
var WAY_MIN_DISTANCE = 12;
var METERS_PER_BLOCK = 95;
var BUILDINGS = 300;
function randomPoint(height, width) {
    var x = Math.random() * width;
    var y = Math.random() * height;
    return new point_1.default(x, y);
}
function testLocation(map, location) {
    for (var _i = 0, _a = map.getIntersections(); _i < _a.length; _i++) {
        var intersection = _a[_i];
        var distance = location.getDistance(intersection.getLocation());
        if (distance < INTERSECTION_DISTANCE) {
            return false;
        }
    }
    for (var _b = 0, _c = map.getBuildings(); _b < _c.length; _b++) {
        var building_2 = _c[_b];
        var distance = location.getDistance(building_2.getLocation());
        if (distance < BUILDING_DISTANCE) {
            return false;
        }
    }
    var closestWay = null;
    for (var _d = 0, _e = map.getWays(); _d < _e.length; _d++) {
        var way = _e[_d];
        var distance = way.getDistance(location);
        if (distance < WAY_MIN_DISTANCE) {
            return false;
        }
        if (!closestWay || closestWay.getDistance(location) > distance) {
            closestWay = way;
        }
    }
    if (closestWay.getDistance(location) > WAY_MAX_DISTANCE) {
        return false;
    }
    var address = closestWay.getAddress(location);
    console.log(address);
    var building = new building_1.default(location, closestWay, address);
    map.addBuilding(building);
    return true;
}
function generateBuildings(map, count) {
    for (var i = 1; i <= count; i++) {
        var success = false;
        while (!success) {
            var location_1 = randomPoint(map.getHeight(), map.getWidth());
            if (testLocation(map, location_1)) {
                success = true;
            }
        }
    }
}
function buildGrid(height, width) {
    var gridIntersections = [];
    var ways = [];
    var xBlocks = Math.floor(width / METERS_PER_BLOCK);
    var yBlocks = Math.floor(height / METERS_PER_BLOCK);
    for (var x = 0; x <= xBlocks; x++) {
        gridIntersections[x] = [];
        for (var y = 0; y <= yBlocks; y++) {
            gridIntersections[x][y] = new intersection_1.default(new point_1.default(x * METERS_PER_BLOCK, y * METERS_PER_BLOCK));
            if (x > 0) {
                ways.push(new way_1.default(gridIntersections[x][y], gridIntersections[x - 1][y]));
            }
            if (y > 0) {
                ways.push(new way_1.default(gridIntersections[x][y], gridIntersections[x][y - 1]));
            }
        }
    }
    var intersections = [];
    for (var x = 0; x < xBlocks; x++) {
        for (var y = 0; y < yBlocks; y++) {
            intersections.push(gridIntersections[x][y]);
        }
    }
    var map = new map_1.default(height, width, intersections, ways);
    generateBuildings(map, BUILDINGS);
    return map;
}
exports.buildGrid = buildGrid;
//# sourceMappingURL=grid.js.map