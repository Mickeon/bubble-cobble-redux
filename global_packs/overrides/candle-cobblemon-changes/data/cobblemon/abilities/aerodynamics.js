{
    onTryHit(target, source, move) {
      if (target !== source && move.type === "Flying") {
        if (!this.boost({ spe: 1 })) {
          this.add("-immune", target, "[from] ability: Aerodynamics");
        }
        return null;
      }
    },
    flags: { breakable: 1 },
    name: "Aerodynamics",
    rating: 3
  }