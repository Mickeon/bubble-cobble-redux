#version 150

in vec3 Position;
in vec4 Color;

uniform mat4 ModelViewMat;
uniform mat4 ProjMat;

out vec4 vertexColor;

void main() {
    gl_Position = ProjMat * ModelViewMat * vec4(Position, 1.0);

    vertexColor = Color;
	// This is targeted to the dark menu overlay.
	// Because of EZActions, the blurring doesn't work. Overriding its shader
	// causes the radial menu to appear blurred, as well, which is underirable.
	// Alright, this shader doesn't go through the Pause Menu.
	// Let's do something mildly neat.
	// if(vertexColor.r == 0.0627451 && vertexColor.a >= 0.7 && vertexColor.a < 0.9) {
	if (vertexColor.r == 0.0627451 && vertexColor.a >= 0.7 && vertexColor.a < 0.9) {
		// vertexColor.a = 0;
		// vertexColor.a = 0.7;
		// vertexColor.b += 0.05 + 0.1 * gl_Position.x;

		float normalized_position = (gl_Position.x + 1.0) * 0.5; // 0.0 to 1.0 .
		vertexColor.a = 0.6 + normalized_position * 0.3;
		vertexColor.r += 0.0 - normalized_position * 0.025;
		vertexColor.b += 0.025 - 0.05 * gl_Position.x;
	}
}
