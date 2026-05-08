(function () {
  if (sessionStorage.getItem('ssu_visited')) return;
  fetch('https://api.countapi.xyz/hit/findwhatiwant/ssu-innovation-visitors')
    .then(() => sessionStorage.setItem('ssu_visited', '1'))
    .catch(() => {});
})();
