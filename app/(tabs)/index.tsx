import { Image } from 'expo-image';
import { Button, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('test.db');

const query1 = `SELECT 
    pck.Id AS PackingId,
    r.Id AS RuleId,
    r.RuleType,
    r.Description AS RuleDescription,
    ss.Code AS PbsCode,
    pt.PbsType,
    COALESCE(ss.NumberRepeats, ss.OriginalNumberRepeats) AS Repeats,
    OriginalMaxQuantityPack AS MaxQtyPacks,
    CASE WHEN UnitOfMeasure IS NULL THEN CAST(MaxQuantity AS varchar(10)) ELSE MaxQuantity || ' ' || UnitOfMeasure END AS MaxQtyUnits,
    pssm.NumberOfPack,
    pssm.PbsEquiv,
    pck.AU_ARTG as Artg,
    pt.ProgramCode AS ProgramCode,
    pt.ProgramDescription,
    pssm.TgpPrice,
    pssm.BppPrice,
    pssm.PbsPrice,
    ss.Name AS SubsidySchemeName
  FROM 
    ProductGrouping pg
    INNER JOIN Brand b ON pg.BrandId = b.Id
    INNER JOIN rel_Brand_Monograph rbm ON rbm.BrandId = b.Id
    INNER JOIN Monograph m ON m.Id = rbm.MonographId
    INNER JOIN rel_Product_ProductGrouping rpp ON rpp.ProductGroupingId = pg.Id 
    INNER JOIN Packing pck ON pck.ProductId = rpp.ProductId
    INNER JOIN PackingSubsidySchemeMapping pssm ON pck.Id = pssm.PackingId
    INNER JOIN SubsidyScheme ss ON pssm.SubsidySchemeId = ss.Id 
    LEFT JOIN Rule r ON r.Id = pssm.RuleId
    LEFT JOIN PbsProgramType pt ON pt.ProgramCode = ss.DrugTypeCode
  WHERE 
    m.Id = '0003fef3-5c71-4c09-9524-14b6441df6b4'
  ORDER BY 
    ss.Code;
`
const query2 = `SELECT 
    pck.Id AS PackingId,
    r.Id AS RuleId,
    r.RuleType,
    r.Description AS RuleDescription,
    pssm.NumberOfPack,
    pssm.PbsEquiv,
    pck.AU_ARTG as Artg,
    pssm.TgpPrice,
    pssm.BppPrice,
    pssm.PbsPrice
  FROM 
    ProductGrouping pg
    INNER JOIN Brand b ON pg.BrandId = b.Id
    INNER JOIN rel_Brand_Monograph rbm ON rbm.BrandId = b.Id
    INNER JOIN Monograph m ON m.Id = rbm.MonographId
    INNER JOIN rel_Product_ProductGrouping rpp ON rpp.ProductGroupingId = pg.Id 
    INNER JOIN Packing pck ON pck.ProductId = rpp.ProductId
    INNER JOIN PackingSubsidySchemeMapping pssm ON pck.Id = pssm.PackingId
    LEFT JOIN Rule r ON r.Id = pssm.RuleId
  WHERE 
    m.Id = '0003fef3-5c71-4c09-9524-14b6441df6b4'
`

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <Button color='red' title='Slow Query' onPress={async () => {
          const result1 = await db.getAllAsync(query1)
          console.log({ result1 })
          const result2 = await db.getAllAsync(query2)
          console.log({ result2 })
        }} />
        <Button color='red' title='Fast Query' onPress={async () => {
          const result2 = await db.getAllAsync(query2)
          console.log({ result2 })
        }} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
