import React from 'react';
import { Font, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5
  },
  title1: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 12,
    margin: 12,
    lineHeight: 2
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    lineHeight: 1
  },
  p1: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5
  },
  adviser: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5
  },
  date: {
    margin: 12,
    fontSize: 16,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    lineHeight: 1
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

// Create Document Component
const MyDocument = ({ date, studentName, studentNo, adviserName, officerName }) => (
  <Document>
    <Page size="LETTER" style={styles.body}>
      <Text style={styles.title}>University of the Philippines Los Baños</Text>
      <Text style={styles.title1}> College of Arts and Sciences {'\n'}
	  Institute of Computer Science</Text>

      <Text style={styles.subtitle}>
      _______________________________________________________________________________
      </Text>
      <Text style={styles.date}>
      	{date}{'\n'}{'\n'}
      </Text>
      <Text style={styles.p1}>
        This document certifies that {studentName}, {studentNo} has satisfied
the clearance requirements of the institute.
      {'\n'}
      {'\n'}
      {'\n'}
      </Text>
    
      <Text style={styles.text}>
        Verified:
        {'\n'}{'\n'}
      </Text>

      <Text style={styles.adviser}>
        Academic Adviser: {adviserName} {'\n'}
        Clearance Officer: {officerName}
      </Text>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);


export { MyDocument };