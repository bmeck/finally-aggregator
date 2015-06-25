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

Cleanup.prototype.finish = function (all_done) {
  if (this.finished) {
    throw new Error('already finished');
  }
  this.finished = true;
  var errs = [];
  if (this.todo) for (var i = 0; i < this.todo.length; i++) {
    setImmediate(function (action) {
      var used = false;
      function use() {
        if (used) return;
        used = true;
        next();
      }
      try {
        action(use);
      }
      catch (e) {
        errs.push(e);
        use();
      }
    }, this.todo[i]);
  }
  function next() {
    i--;
    if (i == 0 && typeof all_done === 'function') {
      all_done(null, errs);
    }
  }
  this.todo = null;
}
