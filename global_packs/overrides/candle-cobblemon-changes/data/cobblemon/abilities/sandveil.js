{
    onImmunity(type, pokemon) {
      if (type === "sandstorm")
        return false;
    },
    onModifySpDPriority: 5,
    onModifySpD(spd, pokemon) {
      if (["sandstorm"].includes(pokemon.effectiveWeather())) {
        return this.chainModify(1.2);
      }
    },
    onModifyDefPriority: 5,
    onModifyDef(def, pokemon) {
      if (["sandstorm"].includes(pokemon.effectiveWeather())) {
        return this.chainModify(1.2);
      }
    },
    flags: { breakable: 1 },
    name: "Sand Veil",
    rating: 2.5,
    num: 8
}