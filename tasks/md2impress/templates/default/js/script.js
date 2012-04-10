(function(app) {

  var $ = function(sel, context) {
    context = context || document;
    return Array.prototype.slice.call(context.querySelectorAll(sel));
  };

  var sections = $('#impress section'),
    ln = sections.length;

  var html = sections.map(function(el, i) {
    return '<a href="$href" title="$title">$text</a>'
      .replace('$href', '#step-' + (i + 1))
      .replace('$title', 'Page ' + (i + 1))
      .replace('$text', '✘');
  });

  var pager = document.createElement('p');
  pager.id = 'pager';
  pager.innerHTML = html.join(' ');
  document.body.appendChild(pager);

  window.addEventListener('hashchange', change, false);

  function change () {
    var hash = location.hash.replace(/^#\/?/, ''),
      active = $('.active', pager)[0],
      step = document.querySelector('a[href="#' + hash + '"]');

    if(active) {
      active.className = active.className.replace('active', '');
      active.textContent = '✔';
    }

    step.className += 'active';
    step.textContent = '☝';

    if(!step) return;
    var done = false;
    $('a', pager).forEach(function(el, i) {
      if(el.href === step.href) {
        done = true;
        return;
      }

      el.textContent = done ? '✘' : '✔';
    });
  }


  app.init();
  console.log('change!');
  change();
})(impress());
