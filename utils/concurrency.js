import cluster from "cluster"
import os from "os"

const numCPUs = os.cpus().length;

export default (cb) => {
    // If the current process is the main one
    if (cluster.isMaster) {
        // Create processes relative to amount of CPUs
        Array.from({
            length: numCPUs
        }, () => cluster.fork());

        // When worker closed
        cluster.on('exit', worker => {
            console.log(`❌ Worker ${worker.process.pid} died.`);
        });
    } else {
        // Call logic
        cb()
    }
}