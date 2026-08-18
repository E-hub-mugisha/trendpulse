<x-mail::message>
# New story submission

**Title:** {{ $submission['title'] }}
**From:** {{ $submission['name'] }} ({{ $submission['email'] }})
**OK to publish:** {{ $submission['allow_publication'] ? 'Yes' : 'No' }}
**OK to contact:** {{ $submission['allow_contact'] ? 'Yes' : 'No' }}

---

{{ $submission['story'] }}

---

Reply directly to this email to reach the submitter.
</x-mail::message>