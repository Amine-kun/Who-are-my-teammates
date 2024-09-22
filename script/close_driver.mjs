import psList from "ps-list";

const close_driver = async () => {

	 const processes = await psList();
     const chromeProcesses = processes.filter(p => p.name.toLowerCase().includes('chrome'));

     chromeProcesses.forEach(p => {
        try {
            Process.kill(p.pid);
        } catch (err) {
        }
    })
}

module.exports = {
    close_driver
}