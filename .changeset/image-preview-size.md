---
'@hina-ui/vue': minor
---

Add optional previewSize metadata to Image and LightboxItem. Known intrinsic dimensions determine the initial preview fit and zoom limits before loading, keeping the frame stable when the larger image arrives and allowing rectangle-source transitions to start without waiting for decoding. Invalid or omitted dimensions retain automatic sizing.
