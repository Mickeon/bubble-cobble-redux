{
    onSourceModifyDamage(damage, source, target, move) {
      if (target.getMoveHitData(move).typeMod > 0) {
        this.debug("Primal Armor neutralize");
        return this.chainModify(0.5);
      }
    },
    flags: { breakable: 1 },
    name: "Primal Armor",
    rating: 3
  }