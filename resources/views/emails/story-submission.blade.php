<x-mail::message>
# 📖 New Story Submission

A new story has been submitted for review.

<x-mail::panel>
**Title:** {{ $submission['title'] }}
**Author:** {{ $submission['name'] }}
**Email:** {{ $submission['email'] }}
</x-mail::panel>

<x-mail::table>
| Permission | Status |
| :--- | :--- |
| Approved for publication | {{ $submission['allow_publication'] ? '✅ Yes' : '❌ No' }} |
| Approved for direct contact | {{ $submission['allow_contact'] ? '✅ Yes' : '❌ No' }} |
</x-mail::table>

---

## {{ $submission['title'] }}
*by {{ $submission['name'] }}*

{{ $submission['story'] }}

---

<x-mail::button :url="'mailto:' . $submission['email'] . '?subject=' . urlencode('Re: ' . $submission['title'])">
Reply to {{ $submission['name'] }}
</x-mail::button>

You can also simply reply directly to this email to reach the submitter.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>