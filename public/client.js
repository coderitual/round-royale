(function () {
'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

console.log(canvas.width, canvas.height);

}());
