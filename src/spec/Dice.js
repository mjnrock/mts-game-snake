const Dice = {
	random: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: (X, Y, Z = 0) => {
		let value = 0;
		for(let i = 0; i < X; i++) {
			value += Dice.random(1, Y);
		}
		
		return value + Z;
	},

	coin: () => {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: (Z = 0) => {
		return Dice.roll(1, 2) + Z;
	},
	d3: (Z = 0) => {
		return Dice.roll(1, 3) + Z;
	},
	d4: (Z = 0) => {
		return Dice.roll(1, 4) + Z;
	},
	d6: (Z = 0) => {
		return Dice.roll(1, 6) + Z;
	},
	d10: (Z = 0) => {
		return Dice.roll(1, 10) + Z;
	},
	d12: (Z = 0) => {
		return Dice.roll(1, 12) + Z;
	},
	d20: (Z = 0) => {
		return Dice.roll(1, 20) + Z;
	},
	d25: (Z = 0) => {
		return Dice.roll(1, 25) + Z;
	},
	d50: (Z = 0) => {
		return Dice.roll(1, 50) + Z;
	},
	d100: (Z = 0) => {
		return Dice.roll(1, 100) + Z;
	},

	weighted: (weights, values) => {                
		let total = 0;
		for(let i in weights) {
			total += weights[i];
		}
		
		let roll = Dice.random(1, total);
		
		let count = 0;
		for(let i = 0; i < weights.length; i++) {
			count += weights[i];
			
			if(roll <= count) {
				return values[i];
			}
		}
		
		return values[values.length - 1];
	}
}

export default Dice;