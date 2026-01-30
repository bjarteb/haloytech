---
title: "Terminal Trick: mex - multiple executions"
description: "Discover a powerful terminal trick for executing multiple commands efficiently with mex."
pubDate: 2026-01-30
tags: ["terminal", "cli", "productivity", "bash"]
heroImage: "/storrinden-nedfall-01.jpg"
draft: false
---

## Introduction

Have you ever found yourself needing to run the same command multiple times with different arguments in your terminal? Or perhaps you need to execute a series of related commands in a loop? The "mex - multiple executions" trick can significantly boost your command-line productivity.

This post will explore how to leverage mex to streamline your workflow and save precious keystrokes.

<script async src="https://asciinema.org/a/u9cBkc6oLWCrTLxN.js" id="asciicast-u9cBkc6oLWCrTLxN" data-size="big"></script>

## What is mex?

mex (multiple executions) is a bash function that allows you to execute a command multiple times with a single keypress. It's particularly useful when you need to run the same command repeatedly or when you want to execute a command against multiple items in a sequence.

### The mex Function

Here's the complete bash function:

```bash
mex() {
  # Helper function to get last non-mex command from history
  _get_last_non_mex_cmd() {
    local cmd
    local offset=1
    while true; do
      cmd=$(fc -ln -${offset} -${offset} 2>/dev/null)
      # Break if we found a non-mex command or reached end of history
      if [[ -z "$cmd" ]] || [[ ! "$cmd" =~ ^[[:space:]]*mex[[:space:]] ]] && [[ ! "$cmd" =~ ^[[:space:]]*mex$ ]]; then
        echo "$cmd"
        return
      fi
      offset=$((offset + 1))
    done
  }

  if [ "$#" -eq 0 ]; then
    local last_cmd=$(_get_last_non_mex_cmd)
    yes | xargs -I{} sh -c "${last_cmd}"
  elif [[ "${1}" =~ ^[0-9]+$ ]]; then
    if [ "$#" -eq 1 ]; then
      local last_cmd=$(_get_last_non_mex_cmd)
      seq "${1}" | xargs -I{} sh -c "${last_cmd}"
    else
      seq "${1}" | xargs -I{} "${@:2}"
    fi
  else
    yes | xargs -I{} "${@}"
  fi
}
```

### How to Use It

To install the function, add it to your shell configuration file (`.bashrc`, `.zshrc`, etc.):

```bash
# Add the mex function to your shell profile
cat >> ~/.bashrc << 'EOF'
mex() {
  # ... (paste the function above)
}
EOF

# Reload your shell configuration
source ~/.bashrc
```

## Examples

### Example 1: Repeat Last Command Indefinitely

Run your previous command in a loop until you press `Ctrl+C`:

```bash
$ echo "Running task..."
Running task...
$ mex
# Repeats "echo 'Running task...'" continuously
```

### Example 2: Run Command N Times

Execute a command exactly 5 times:

```bash
$ echo "Task"
Task
$ mex 5
Task
Task
Task
Task
Task
```

### Example 3: Run Command N Times with Arguments

Execute any command multiple times:

```bash
$ mex 3 curl https://example.com
# Runs curl 3 times
```

### Example 4: Continuous Execution

Run a command repeatedly without stopping:

```bash
$ mex echo "Hello"
# Runs "echo Hello" indefinitely until interrupted
```

## Conclusion

The mex bash function is a powerful tool for developers and system administrators who frequently need to execute commands multiple times. Whether you're testing, monitoring, or automating repetitive tasks, mex can save you countless keystrokes and boost your terminal productivity. Simply add it to your shell configuration and start using it today!
