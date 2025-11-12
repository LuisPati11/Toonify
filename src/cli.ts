#!/usr/bin/env node

import { Command } from 'commander';
import { jsonToToon } from './core/jsonToToon.js';
import { toonToJson } from './core/toonToJson.js';
import { validateToon } from './core/validator.js';
import { estimateTokens } from './core/tokenEstimator.js';
import { readInput, writeOutput, detectFormat } from './utils/file.js';
import * as logger from './utils/logger.js';
import * as fs from 'fs';

const program = new Command();

program
  .name('toonify')
  .description('CLI utility for converting between JSON and TOON format')
  .version('1.0.0');

program
  .argument('<input>', 'Input file path')
  .option('--to <format>', 'Target format: json or toon', (value) => {
    if (value !== 'json' && value !== 'toon') {
      throw new Error('--to must be either "json" or "toon"');
    }
    return value;
  })
  .option('--compact', 'Remove whitespace and line breaks (TOON only)')
  .option('--estimate-tokens', 'Show token count estimates')
  .option('--validate', 'Validate TOON format structure')
  .action(async (input: string, options: any) => {
    try {
      // Check if input file exists
      if (!fs.existsSync(input)) {
        logger.error(`File not found: ${input}`);
        process.exit(1);
      }

      // Read input file
      const inputContent = readInput(input);
      const inputFormat = detectFormat(input, inputContent);

      // Validate flag only works with TOON input
      if (options.validate) {
        if (inputFormat !== 'toon') {
          logger.error('Validation only works with TOON format files');
          process.exit(1);
        }

        const validation = validateToon(inputContent);
        if (validation.valid) {
          logger.success('TOON format is valid');
        } else {
          logger.error('TOON validation failed:');
          validation.errors.forEach((err) => logger.error(`  ${err}`));
          process.exit(1);
        }
        return;
      }

      // Check if --to option is provided when not validating
      if (!options.to) {
        logger.error('--to option is required for conversion');
        process.exit(1);
      }

      // Determine target format
      const targetFormat = options.to as 'json' | 'toon';

      // Validate conversion direction
      if (inputFormat === targetFormat) {
        logger.error(
          `Input is already in ${targetFormat} format. Use --to to specify a different target format.`
        );
        process.exit(1);
      }

      // Perform conversion
      let outputContent: string;
      if (targetFormat === 'toon') {
        // JSON to TOON
        const jsonData = JSON.parse(inputContent);
        outputContent = jsonToToon(jsonData, options.compact || false);
      } else {
        // TOON to JSON
        const jsonData = toonToJson(inputContent);
        outputContent = JSON.stringify(jsonData, null, 2);
      }

      // Generate output filename
      const outputExt = targetFormat === 'toon' ? '.toon' : '.json';
      const outputFile = input.replace(/\.(json|toon)$/, outputExt);

      // Write output file
      writeOutput(outputFile, outputContent);

      // Display success message
      logger.success(
        `Converted ${logger.formatFileName(input)} → ${logger.formatFileName(outputFile)}`
      );

      // Token estimation if requested
      if (options.estimateTokens) {
        const tokensIn = estimateTokens(inputContent);
        const tokensOut = estimateTokens(outputContent);
        const tokenDiff = tokensOut - tokensIn;
        const percentDiff = (tokenDiff / tokensIn) * 100;

        logger.info('');
        logger.info('Token Estimation:');
        logger.info(`  Input:  ${logger.formatNumber(tokensIn)} tokens`);
        logger.info(`  Output: ${logger.formatNumber(tokensOut)} tokens`);
        
        if (tokenDiff < 0) {
          // Tokens saved
          logger.info(`  Saved:  ${logger.formatNumber(Math.abs(tokenDiff))} tokens (${logger.formatPercentage(percentDiff)})`);
        } else if (tokenDiff > 0) {
          // Tokens increased
          logger.info(`  Added:  ${logger.formatNumber(tokenDiff)} tokens (${logger.formatPercentage(percentDiff)})`);
        } else {
          // No change
          logger.info(`  Change: No change`);
        }
      }

      process.exit(0);
    } catch (error) {
      logger.error(`Conversion failed: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
