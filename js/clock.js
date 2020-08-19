class Clock {
	constructor() {
		this._clock = document.querySelector('#clock');
		this._setTime = this._setTime.bind(this);
		this._startClock();
	}

	_appendZero(k) {
		// Append zero if k < 10
		return k = (k < 10) ? '0' + k : k;
	}

	_setTime() {
		// Date object
		const date = new Date();

		// Set hour, minute, mid day
		let hour = date.getHours();
		let min = date.getMinutes();
		let midDay = (hour >= 12) ? 'PM' : 'AM';
		
		hour = (hour === 0) ? 12 : ((hour > 12) ? (hour - 12) : hour);
		hour = this._appendZero(hour);
		min = this._appendZero(min);

		this._clock.innerText = `${hour}:${min} ${midDay}`;
	}

	_startClock() {
		this._setTime();
		setInterval(this._setTime, 1000);
	}
}
