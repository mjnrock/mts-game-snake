class LinkedListNode {
	constructor(data) {
		this.data = data;
		this.previous = null;
		this.next = null;
    }

    get $() {
        return this.data;
    }
}

class LinkedList {
	constructor() {
        this._length = 0;        
		this._head = null;
		this._tail = null;
    }
    
    isEmpty() {
        return this._length <= 0;
    }

    each(fn) {
        if(typeof fn === "function") {            
            let curr = this._head,
                i = 0;
            
            while (i < this._length) {
                fn(curr, i);
                curr = curr.next;
                i++;
            }
            
            return curr;
        }
    }

    size() {
        return this._length;
    }
	get(index) {
		let curr = this._head,
			i = 0;

		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}
		
		while (i < index) {
			curr = curr.next;
			i++;
		}
		
		return curr;
	}

	add(value) {
		let node = new LinkedListNode(value);

		if(this._length > 0) {
			this._tail.next = node;
			node.previous = this._tail;
			this._tail = node;
		} else {
			this._head = node;
			this._tail = node;
		}

		this._length++;

		return this;
	}
	remove(index) {
		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}

		if(index === 0) {
			if(!this._head.next) {
				this._head = null;
				this._tail = null;
			} else {
				this._head = this._head.next;
			}
		} else if(index === this._length - 1) {
			this._tail = this._tail.previous;
		} else {
			let i = 0,
				curr = this._head;
			while(i < index) {
				curr = curr.next;
				i++;
			}
			
			curr.previous.next = curr.next;
			curr.next.previous = curr.previous;
		}
				
		this._length--;
		if(this._length === 1) {
			this._tail = this._head;
		}
		if(this._length > 0) {
			this._head.previous = null;
			this._tail.next = null;
		}


		return this;
	}
}

export default LinkedList;