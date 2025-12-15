let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate();
        let today = `${day} - ${month} - ${year}`;
        $("#fulldte").html(`${today} :: `);
        $("#day").html(`${todayDate()} :: `);
        setInterval(() => {
            let hour = new Date().getHours();
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            document.getElementById("rtime").innerHTML =`${hour} : ${minute} : ${second}`; 
            
        }, 1000);