import * as React from "react";

interface PluginSettingsProps {
	includeTags: string;
	excludeTags: string;
	onChange: (includeTags: string, excludeTags: string) => void;
}

export function PluginSettings({
	includeTags,
	excludeTags,
	onChange,
}: PluginSettingsProps) {
	const [includeTagsValue, setIncludeTagsValue] = React.useState(includeTags);
	const [excludeTagsValue, setExcludeTagsValue] = React.useState(excludeTags);

	React.useEffect(() => {
		setIncludeTagsValue(includeTags);
		setExcludeTagsValue(excludeTags);
	}, [includeTags, excludeTags]);

	return (
		<div>
			<h1>Settings</h1>

			<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
				<div>
					<input
						value={includeTagsValue}
						placeholder="Include tags"
						onChange={(e) => {
							setIncludeTagsValue(e.target.value);
							onChange("includeTags", e.target.value);
						}}
					/>
				</div>
				<div>
					<input
						value={excludeTagsValue}
						placeholder="Exclude tags"
						onChange={(e) => {
							setExcludeTagsValue(e.target.value);
							onChange("excludeTags", e.target.value);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
