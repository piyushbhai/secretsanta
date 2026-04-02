class SantaEngine {
  constructor(employees, previousPairs = []) {
    if (!employees || employees.length < 2) {
      throw new Error('need at least 2 people for secret santa');
    }
    this.employees = employees;

    this.lastYearMap = {};
    for (const pair of previousPairs) {
      this.lastYearMap[pair.giverEmail] = pair.receiverEmail;
    }
  }

  generate() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const result = this._attempt();
      if (result !== null) return result;
    }

    throw new Error(
      'couldnt generate valid assignments after 100 attempts - maybe too many constraints from last year?'
    );
  }

  _attempt() {
    const receivers = [...this.employees];
    this._fisherYatesShuffle(receivers);

    const assignments = [];

    for (let i = 0; i < this.employees.length; i++) {
      const giver = this.employees[i];
      const receiver = receivers[i];

      if (giver.email === receiver.email) return null;

      if (this.lastYearMap[giver.email] === receiver.email) return null;

      assignments.push({
        giverName: giver.name,
        giverEmail: giver.email,
        receiverName: receiver.name,
        receiverEmail: receiver.email
      });
    }

    return assignments;
  }

  _fisherYatesShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}

module.exports = SantaEngine;