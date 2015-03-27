function Cleanup() {
  this.todo = null;
  this.finished = false;
}
module.exports = Cleanup;

Cleanup.prototype.add = function (fn) {
  if (this.finished) {
    fn();
  }
  if (this.todo != null) {
    this.todo.push(fn);
  }
  else {
    this.todo = [fn];
  }
}

Cleanup.prototype.finish = function () {
  if (this.finished) {
    throw new Error('already finished');
  }
  this.finished = true;
  var errs = [];
  for (var i = 0; i < this.todo.length; i++) {
    try {
      var action = this.todo[i];
      action();
    }
    catch (e) {
      errs.push(e);
    }
  }
  this.todo = null;
  if (errs.length) throw errs;
}
