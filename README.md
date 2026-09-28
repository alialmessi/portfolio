# Ali Almasi — Portfolio & CV

Personal portfolio for **Ali Almasi**: strategy, business development and venture investing across fintech and digital assets.

The site has three views of the same profile. The switcher at the top reorders the headline, key numbers, case studies, approach and CV for each direction:

| View | Link | CV |
|---|---|---|
| Strategy | `?lens=strategy` | `resume/Ali_Almasi_CV_Strategy.pdf` |
| Business Development | `?lens=bd` | `resume/Ali_Almasi_CV_Business_Development.pdf` |
| Investing | `?lens=investing` | `resume/Ali_Almasi_CV_Investing.pdf` |

## Case studies
- **Wallex:** a research-to-allocation engine for digital assets (500+ protocols, 35% annualized, 1.55 Sharpe)
- **iToll:** launching a new on-demand automotive-services line
- **Mohajer:** designing a fintech proposition for Iran's mass-affluent

## Structure
```
index.html            Home page (all three views)
work/                 Case study pages
resume/index.html     CV source (one file, three versions)
resume/*.pdf          Generated one-page CVs
assets/               Styles, script, icon, social preview image
```

Plain HTML/CSS with no build step, hosted on GitHub Pages.
