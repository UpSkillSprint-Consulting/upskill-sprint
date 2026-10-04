/* Keep compact navigation and keyboard-operated desktop tabs in sync. */
(function(){
 'use strict';
 const picker=document.getElementById('calc-workspace');
 if(!picker)return;
 const tabs=[...document.querySelectorAll('#calculator-shell .tab[data-page]')];
 tabs.forEach(tab=>{
  const option=document.createElement('option');option.value=tab.dataset.page;option.textContent=tab.textContent;picker.append(option);
  tab.addEventListener('click',()=>{picker.value=tab.dataset.page;});
 });
 picker.value=tabs.find(tab=>tab.classList.contains('active'))?.dataset.page||tabs[0]?.dataset.page;
 picker.addEventListener('change',()=>tabs.find(tab=>tab.dataset.page===picker.value)?.click());
})();
