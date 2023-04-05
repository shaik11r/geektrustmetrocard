const fs = require("fs");
const filename = process.argv[2];
const input = fs.readFileSync(filename, "utf8");
const collections = {
  AIRPORT: {
    ADULT: 0,
    SENIOR_CITIZEN: 0,
    KID: 0,
    TOTAL: 0,
    DISCOUNT: 0,
  },
  CENTRAL: {
    ADULT: 0,
    SENIOR_CITIZEN: 0,
    KID: 0,
    TOTAL: 0,
    DISCOUNT: 0,
  },
};

const balances = {};

input.split("\n").forEach((line) => {
  const tokens = line.split(" ");
  if (tokens[0] === "BALANCE") {
    const metrocard = tokens[1];
    const balance = parseInt(tokens[2]);
    balances[metrocard] = {
      metrocardnumber: metrocard,
      balance: balance,
      count: 0,
    };
  }

  if (tokens[0] === "CHECK_IN") {
    const metrocard = tokens[1];
    const passengerType = tokens[2];
    const destination = tokens[3];
    if (balances[metrocard].metrocardnumber === metrocard) {
      balances[metrocard].count++;
    }
    let cost = 0;
    if (passengerType === "ADULT") {
      cost = 200;
    } else if (passengerType === "SENIOR_CITIZEN") {
      cost = 100;
    } else if (passengerType === "KID") {
      cost = 50;
    }
    if (balances[metrocard].count === 2) {
      cost = cost * 0.5;
      collections[destination].DISCOUNT = cost;
      balances[metrocard].count = 0;
    }
    const remaining = balances[metrocard].balance - cost;
    if (remaining >= 0) {
      balances[metrocard].balance = remaining;
      collections[destination][passengerType]++;
      collections[destination].TOTAL += cost;
    } else {
      const rechargeAmount = Math.abs(remaining) * 0.02;
      balances[metrocard].balance = 0;
      collections[destination][passengerType]++;
      collections[destination].TOTAL += cost + rechargeAmount;
    }
  }
});

console.log(
  "TOTAL_COLLECTION CENTRAL",
  collections.CENTRAL.TOTAL,
  collections.CENTRAL.DISCOUNT
);
console.log("PASSENGER_TYPE_SUMMARY");
if (collections.CENTRAL.ADULT) {
  console.log("ADULT", collections.CENTRAL.ADULT);
}
if (collections.CENTRAL.KID) {
  console.log("KID", collections.CENTRAL.KID);
}
if (collections.CENTRAL.SENIOR_CITIZEN) {
  console.log("SENIOR_CITIZEN", collections.CENTRAL.SENIOR_CITIZEN);
}
console.log(
  "TOTAL_COLLECTION AIRPORT",
  collections.AIRPORT.TOTAL,
  collections.AIRPORT.DISCOUNT
);
console.log("PASSENGER_TYPE_SUMMARY");
if (collections.AIRPORT.ADULT) console.log("ADULT", collections.AIRPORT.ADULT);

if (collections.AIRPORT.KID) {
  console.log("KID", collections.AIRPORT.KID);
}
if (collections.AIRPORT.SENIOR_CITIZEN) {
  console.log("SENIOR_CITIZEN",collections.AIRPORT.SENIOR_CITIZEN);
}