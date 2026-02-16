#version 150

in vec4 vertexColor;

uniform vec4 ColorModulator;

out vec4 fragColor;

void main() {
    vec4 color = vertexColor;
    if (color.a == 0.0) {
        discard;
    }
    // Tone down the slot highlight when hovering over an item in a menu.
    if (
        all(lessThanEqual(color, vec4(1.0, 1.0, 1.0, 0.51)))
    && all(greaterThan(color, vec4(0.99, 0.99, 0.99, 0.5)))
    ) {
        color *= vec4(0.9, 0.9, 1.0, 0.4);
    }
    fragColor = color * ColorModulator;
}
