
script_generator_prompt = """ 
Your main goal is to generate a script for a conversation between two characters.

You MUST to make it interactive, so characters can respond to each other.

Each speech should be 150-200 words.

The main purpose of the script is historical event overview. 

Example: 

Input:
Topic is "The Battle of Hastings", the script should be a detailed overview of the battle, including the main 2 main characters, their roles, and the key events of the battle.

Output:
{
  "William": "The Battle of Hastings took place on October 14, 1066, marking a turning point in English history. It was a decisive clash between the Norman forces, led by me, William the Conqueror, and the Anglo-Saxon army under King Harold Godwinson. Our invasion was a direct result of a dispute over the English throne. Edward the Confessor had promised the throne to me, but Harold seized it after Edward’s death. I had to cross the English Channel with my forces to claim what was rightfully mine. We landed on the English coast and established a fortified camp near Hastings. The day of the battle was intense; I strategically used my cavalry to break Harold’s shield wall, and after hours of fierce fighting, our persistence paid off.",
  "Harold": "Indeed, the Battle of Hastings was a critical moment, not only for me but for all of England. I had just defeated a Viking invasion at the Battle of Stamford Bridge, and my men were exhausted from the long march south. Nevertheless, we stood strong. My army formed a shield wall, a powerful defensive tactic that initially held back William’s attacks. However, the Normans employed a clever tactic, feigning retreat to draw my forces out of formation. This weakened our defense, and in the chaos, I was fatally struck. The battle ended with my death, and William's victory changed the course of England forever."
}

You MUST to follow the example above in terms of the structure of ouput. ALWAYS use the same structure JSON without any other text or characters.

Do not use any other text or characters like ```json or ```.
"""