import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';
import { ContentKitIcon } from '@gitbook/api';

import { extractAhaSlidesEmbed } from './embed';

interface AhaSlidesInstallationConfiguration {}

type AhaSlidesRuntimeEnvironment = RuntimeEnvironment<AhaSlidesInstallationConfiguration>;
type AhaSlidesRuntimeContext = RuntimeContext<AhaSlidesRuntimeEnvironment>;

/**
 * Custom block that renders a live, interactive AhaSlides template inside a
 * sandboxed <webframe> — the GitBook equivalent of the Webflow blog's
 * "Try it" iframe.
 *
 * Props:
 *   - `url`        the raw link the author pasted / typed.
 *   - `embedUrl`   the canonical presenter URL we actually frame (derived on
 *                  paste via the `@link.unfurl` action).
 *   - `templateId` the share/template id, when we could extract one.
 */
const embedBlock = createComponent<{
    url?: string;
    embedUrl?: string;
    templateId?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            // Fired when an author pastes a matching link into the editor (the
            // `urlUnfurl` patterns in gitbook-manifest.yaml) — turn the link into
            // a configured embed block.
            case '@link.unfurl': {
                const { url } = action;
                const { templateId, embedUrl } = extractAhaSlidesEmbed(url);
                return {
                    props: {
                        url,
                        templateId,
                        embedUrl,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { environment } = context;
        const { url, embedUrl } = element.props;

        // Not yet configured (block inserted from the `/` menu with no link, or
        // an unrecognised URL) → show a card that links out instead of an empty
        // frame.
        if (!embedUrl) {
            return (
                <block>
                    <card
                        title={'AhaSlides'}
                        hint={
                            'Paste an AhaSlides template or share link to embed a live, interactive slide deck.'
                        }
                        onPress={{
                            action: '@ui.url.open',
                            url: url ?? 'https://ahaslides.com',
                        }}
                        icon={
                            environment.integration.urls.icon ? (
                                <image
                                    source={{ url: environment.integration.urls.icon }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        // 16:9 matches the AhaSlides player and the blog's 56.25% responsive
        // wrapper. A single overlay button opens the deck full-screen in a new
        // tab.
        return (
            <block>
                <webframe
                    source={{ url: embedUrl }}
                    aspectRatio={16 / 9}
                    buttons={[
                        <button
                            label="Open in AhaSlides"
                            icon={ContentKitIcon.Maximize}
                            tooltip="Open in AhaSlides"
                            onPress={{ action: '@ui.url.open', url: url ?? embedUrl }}
                        />,
                    ]}
                />
            </block>
        );
    },
});

export default createIntegration<AhaSlidesRuntimeContext>({
    components: [embedBlock],
});
