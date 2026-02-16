#version 150

uniform sampler2D DiffuseSampler;

in vec2 texCoord;
in vec2 sampleStep;

uniform float Radius;
uniform float RadiusMultiplier;

out vec4 fragColor;

void main() {
    // vec4 blurred = vec4(0.0);
    // float actualRadius = round(Radius * RadiusMultiplier);
    // for (float a = -actualRadius + 0.5; a <= actualRadius; a += 2.0) {
    //     blurred += texture(DiffuseSampler, texCoord + sampleStep * a);
    // }
    // blurred += texture(DiffuseSampler, texCoord + sampleStep * actualRadius) / 2.0;
    // fragColor = blurred / (actualRadius + 0.5);

    // Change color on the bottom-left specifically (aimed at Tips).
    float actualRadius = round(Radius * RadiusMultiplier);
    float strength = max( ((1.0 - texCoord.x - texCoord.y) * 2.0 - 1.0), 0.0) * actualRadius;
    vec4 shade_color = vec4(-0.75, -1.0, -0.5, 0.0) * 0.1;
    vec4 blurred = shade_color * strength;
    for (float a = -actualRadius + 0.5; a <= actualRadius; a += 2.0) {
        blurred += texture(DiffuseSampler, texCoord + sampleStep * a);
    }
    blurred += texture(DiffuseSampler, texCoord + sampleStep * actualRadius) / 2.0;
    fragColor = blurred / (actualRadius + 0.5);
}
