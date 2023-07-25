# GPT Custom

GPT Custom (working title) is a web extension that enables you to easily experiment with
a webpage's content and GPT prompts.

I find this useful in a number of use cases where I'm reading
content, but want to ask something about it, summarise it, or otherwise synthesise it in
an interesting way.

It's also a great starting point for building your own web extension powered by GPT.

## Minimal starter kit

- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Development

Follow these simple steps to get started with GPT Custom development:

1. **Clone this repository:**

```bash
git clone https://github.com/jckw/gpt-custom.git
cd gpt-custom
```

2. **Install dependencies:**

```bash
yarn install
```

3. **Start the development server:**

```bash
yarn dev
```

Upon successful execution, the `dist/` folder will be created.

4. **Load the extension into your browser:**

   - Open the Extension Management page by navigating to `chrome://extensions` in your
     Chrome browser.
   - Enable **Developer Mode** by toggling the switch located at the top right corner.
   - Click the **Load unpacked** button and select the `dist/` folder that was created
     in the previous step.

5. **Start hacking!**

Now you're all set to dive into the code in `src/`. Any changes you make will trigger an
automatic reload, even for the content script.

## Contribution

Contributions to GPT Custom are welcome. If you have any bug fixes, new features, or
improvements in mind, feel free to open a pull request.
