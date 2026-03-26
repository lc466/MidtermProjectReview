// Minimal gallery placeholder (expand later)
document.addEventListener('click', function(e){
  var t = e.target;
  if (t.tagName === 'IMG' && t.closest('.gallery-grid')){
    var src = t.getAttribute('src');
    var win = window.open(src,'_blank');
    if (!win) alert('Open image in new tab: ' + src);
  }
});
