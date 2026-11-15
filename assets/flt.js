(function(){var q=document.getElementById('flt');if(!q)return;var cs=[].slice.call(document.querySelectorAll('[data-flt]'));var n=document.getElementById('fltn');
function run(){var v=q.value.toLowerCase().trim();var c=0;cs.forEach(function(e){var ok=!v||e.getAttribute('data-flt').indexOf(v)>-1;e.hidden=!ok;if(ok)c++;});if(n)n.textContent=v?(c+' shown'):'';}
q.addEventListener('input',run);})();