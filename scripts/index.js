// change index page tile when inactive tab
(function() {
    const originalTitle = document.title;
    const newTitle = "Heeey, come back!";
    let titleInterval;
    
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        let isOriginal = false;
        titleInterval = setInterval(function() {
          document.title = isOriginal ? originalTitle : newTitle;
          isOriginal = !isOriginal;
        }, 2000);
        document.title = newTitle;
      } else {
        clearInterval(titleInterval);
        document.title = originalTitle;
      }
    });
  })();