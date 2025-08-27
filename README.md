# Claude Lens Backend

A backend service for managing Claude Code conversation scheduling and token usage synchronization.

## Overview

This project serves as the backend infrastructure for:

1. **Conversation Scheduling**: Automatically initiates Claude Code conversations to provide users with additional resets beyond the standard 5-hour daily limitation during working hours
2. **Token Usage Synchronization**: Syncs token usage data from multiple client machines running the `claude-lens-client` project

## Features

- Automated Claude Code conversation starter scheduling
- Multi-client token usage tracking and synchronization
- Working hours optimization for conversation resets
- Centralized backend for distributed client deployments

## Architecture

The service acts as a central hub that:
- Schedules and manages conversation initiations
- Receives and aggregates token usage data from multiple `claude-lens-client` instances
- Provides extended usage capabilities during daily working hours

## Related Projects

- `claude-lens-client`: Client-side component that runs on individual machines and reports token usage to this backend service