---
name: fish-audio
description: Use when generating voiceovers, speech, sound effects, voice clones, or multi-speaker audio with the Fish Audio MCP server (fish-audio), or when managing Fish Audio voices, Story Studio projects, or the asset library. Covers which tool to pick, how to avoid double charges, and how to confirm credit costs first.
---

# Fish Audio (MCP)

The `fish-audio` MCP server exposes Fish Audio's speech, voice, sound effect, media, Story Studio, and asset tools. Read this before calling any of them.

## Before any tool that charges credits

Tools marked as charging credits below cost real money. Before calling one:

1. Say what you are about to generate: the text (or its length), the voice, and any settings.
2. Give the estimated cost. Use the estimate tools where they exist (`estimate_image_generation`, `estimate_image_edit`, `estimate_video_generation`). For speech, check the per-call text budget and balance with `get_credit_balance` first.
3. Wait for an explicit "yes" from the user. A general request to "make the voiceover" is not approval for a specific paid generation.

Never repeat a paid call to retry. If a response is lost, use `list_speech_history` or `list_media_generations` to find the original job first.

## Choosing a tool

**Voices**
- Find an existing voice: `search_voices`. Use `self=true` to list the workspace's own voices (including private and team voices).
- Details of one voice: `get_voice`.
- Clone from a sample: `create_voice_clone`. If it returns `verification_required`, the real speaker must record the exact prompt sentence. Upload that recording with `get_upload_url`, then pass the URL to `verify_voice_clone`.
- Design from a description: `design_voice` returns 2 samples to listen to. Keep the one the user picks with `save_designed_voice`. Designing is free during the current promotion on paid plans, up to 100 a day.

**Speech**
- Generate with `text_to_speech`. For long text it may return a task id after about 45 seconds. Check it with `get_speech`.
- Transcribe audio with `speech_to_text` (charges credits).
- Recent generations: `list_speech_history`.

**Sound effects** (ambience, foley, impacts only, not speech or music)
- Search the free library first: `search_sound_effects`.
- Generate new ones with `generate_sound_effect` (charges credits). Check the result with `get_audio_task`.

**Images and video**
- Pick a model with `list_media_models` and `get_media_model`.
- Estimate first, then generate with `generate_image`, `generate_image_edit`, or `generate_video`.
- Track progress with `get_generation_status`; fetch the finished result with `get_generation_result`.

**Story Studio** (multi-speaker audio projects)
- Start with `studio_help` for the full manual.
- Projects are made of chapters and blocks. Edit with `studio_write_blocks`. Check progress with `studio_project`.
- Generating audio charges credits. Quote the cost first. Blocks whose text, voice, or settings have not changed keep their audio.
- Voice acting: `studio_import_script` reads a script into a draft for review, then `studio_create_project` creates the project. `studio_perform` and `studio_retake` record lines and charge credits.
- Share a listenable link with `studio_share`. Read its comments with `studio_share_comments`.

**Asset library** (saved images, audio, video, and avatars)
- Browse with `list_assets`, `list_asset_collections`, and `get_asset_collection`.
- Save a finished result with `save_asset`.

**Files**
- Local audio, scripts, or images: `get_upload_url` (audio and scripts) or `create_media_upload` (images, video, audio not already in Fish). Upload the raw bytes with HTTP PUT within one hour, then pass the returned URL to the tool that needs it.
- Anyone with an upload link can upload to it until it expires, so do not share it.

## Limits to remember

- These tools never delete projects, chapters, or assets. Deletion happens in the Fish Audio web app, so tell the user to do it there.
- A long text can take minutes. Poll with `get_speech` or `get_generation_status`. Do not loop tightly.
- Account plan and text limits come from `get_credit_balance`.

## Using this server from this repo

- The server is added to the local Claude config with `claude mcp add --transport http fish-audio https://api.fish.audio/mcp`.
- In this sandbox the connection is refused by the agent proxy unless `api.fish.audio` is in the environment's allowed hosts. Check connectivity with `claude mcp list` before relying on the tools.
- Keep API keys and tokens out of the repo and out of commit messages.
