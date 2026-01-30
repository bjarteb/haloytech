---
title: "Search for Code Snippets"
description: "Quickly search for code snippets and examples directly from the command line using GitHub's search capabilities."
pubDate: 2024-08-12
tags: ["github", "cli", "bash", "productivity", "development"]
draft: false
---

## Introduction

Sometimes you just need to understand how to use the different cloud vendors or platform CLI tools (oci, aws, gcp, azure, aiven and many others). You can browse StackOverflow and learn a lot along the way. But what if you just want to stay on the command line and be presented with a nice output showing variations of the CLI command - even with very creative ways to use it?

The solution is simple: sign up at GitHub and login, then utilize GitHub's powerful search capabilities to look for code directly from your terminal.

## The ghc Function

Here's a bash function that allows you to search GitHub code and automatically open the results in your browser:

```bash
# ghc - GitHub Codesearch
alias ghc='ghc'
ghc() {
    args=("$@")
    SEARCH_STRING_PLUSSIGN=$(printf '%s' "${args[@]/%/+}")
    open "https://github.com/search?q=${SEARCH_STRING_PLUSSIGN%?}&type=code"
}
```

### How It Works

The function takes your search terms as arguments and:

1. Collects all arguments into an array
2. Converts spaces to plus signs (required by GitHub's search API)
3. Opens your browser with a GitHub code search URL pointing to matching code snippets

### Installation

Add the function to your shell configuration file (`.bashrc`, `.zshrc`, etc.):

```bash
cat >> ~/.bashrc << 'EOF'
ghc() {
    args=("$@")
    SEARCH_STRING_PLUSSIGN=$(printf '%s' "${args[@]/%/+}")
    open "https://github.com/search?q=${SEARCH_STRING_PLUSSIGN%?}&type=code"
}
EOF

source ~/.bashrc
```

## Usage Examples

### Searching for AWS EC2 Examples

While working with AWS EC2 in your terminal:

```bash
$ ghc aws ec2
# Opens browser with AWS EC2 code examples
```

### Searching for Cloud Provider CLIs

```bash
$ ghc gcp compute instances
# Opens GitHub search with GCP compute instances examples
```

```bash
$ ghc azure vm create
# Opens GitHub search with Azure VM creation examples
```

### Searching for Kubernetes Examples

```bash
$ ghc kubectl deployment
# Opens GitHub search with Kubernetes deployment examples
```

## Benefits

- **Stay in the Terminal**: No need to leave your command line to search
- **Instant Browser Access**: Results open automatically in your default browser
- **Targeted Searches**: Find real code examples and implementations
- **Learn Different Approaches**: See how various developers solve the same problems
- **Cross-Platform Support**: Works with any cloud provider or CLI tool

## Enjoy!

This simple yet powerful function can significantly speed up your learning and development workflow. Whether you're exploring a new CLI tool or looking for creative ways to use existing ones, GitHub's code search combined with this bash function gives you instant access to real-world examples right from your command line.

Try it out the next time you need to understand how to use a new cloud CLI or find creative implementations of commands you're working with!
