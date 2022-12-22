## 前言

#### 以下內容節錄自：

- [Scheduling In Go : Part I - OS Scheduler](https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part1.html)
- [Scheduling In Go : Part II - Go Scheduler](https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part2.html)
- [Scheduling In Go : Part III - Concurrency](https://www.ardanlabs.com/blog/2018/12/scheduling-in-go-part3.html)

---

## Definition

- ### Program Counter (Instruction Pointer)

  > allows the Thread to keep track of the next instruction to execute. [example](./example/stack-trace/main.go)

- ### Thread States

  #### Waiting:

  > the `Thread` is stopped and waiting for something in order to continue. This could be for reasons like, waiting for the hardware (disk, network), the operating system (system calls) or synchronization calls (atomic, mutexes).

  #### Runnable:

  > the `Thread` wants time on a core so it can execute its assigned machine instructions.

  #### Executing

  > the `Thread` has been placed on a core and is executing its machine instructions.

- ### Preemptive Scheduler
  > The scheduler is unpredictable when it comes to what Threads will be chosen to run at any given time. The physical act of swapping Threads on a core is called a `context switch`. A context switch can cost you `~12k to ~18k` instructions of latency. (it takes take between ~1000 and ~1500 nanoseconds to switch context and the hardware should be able to reasonably execute (on average) 12 instructions per nanosecond per core)

## Core

![go-core](./image/go-core.png)

| Symbol | Description                                                                |
| :----: | -------------------------------------------------------------------------- |
|   P    | Logical Processor for every virtual core.                                  |
|   M    | Every `P` is assigned an OS Thread                                         |
|   G    | initial Goroutine (application-level threads)                              |
|  GRQ   | the Global Run Queue for Goroutines that have not been assigned to a P yet |
|  LRQ   | the Local Run Queue per `P`                                                |

### Cooperating Scheduler

A cooperating scheduler means the scheduler needs well-defined user space events that happen at safe points in the code to make scheduling decisions. There are four classes of events:

- The use of the keyword `go`
- Garbage collection
- System calls
- Synchronization and Orchestration

## Network Poller

Networking-based system calls can be processed asynchronously by many of the OSs we use today, this is accomplished by using:

- kqueue (MacOS)
- epoll (Linux)
- iocp (Windows)

![net-poller-1](./image/net-poller-1.png)
![net-poller-2](./image/net-poller-2.png)
![net-poller-3](./image/net-poller-3.png)

## Synchronous System Calls

One example of a system call that can’t be made asynchronously is file-based system calls. If you are using CGO, there may be other situations where calling C functions will block the M as well.

![sys-call-1](./image/sys-call-1.png)
![sys-call-2](./image/sys-call-2.png)
![sys-call-3](./image/sys-call-3.png)

### Spinning threads

- An M with a P assignment is looking for a runnable goroutine.
- An M without a P assignment is looking for available Ps.
- Scheduler also unparks an additional thread and spins it when it is readying a goroutine if there is an idle P and there are no other spinning threads.

## Work Stealing

![work-stealing-1](./image/work-stealing-1.png)
![work-stealing-2](./image/work-stealing-2.png)
![work-stealing-3](./image/work-stealing-3.png)
![work-stealing-4](./image/work-stealing-4.png)
![work-stealing-5](./image/work-stealing-5.png)

Essentially, Go has turned IO/Blocking work into CPU-bound work at the OS level. Since all the context switching is happening at the application level, we don’t lose the same ~12k instructions (on average) per context switch that we were losing when using Threads. In Go, those same context switches are costing you ~200 nanoseconds or ~2.4k instructions.
