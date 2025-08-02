import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { isUnexpected } from '@azure-rest/ai-inference';
import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const HealthChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello, I am your health assistant. How can I help you today?',
        timestamp: formatTime(),
      },
    ]);
  }, []);

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessageToAzure = async (newMessages: Message[]) => {
    const token = process.env.EXPO_PUBLIC_GITHUB_TOKEN; 
    const endpoint = 'https://models.github.ai/inference';
    const model = 'openai/gpt-4.1';

    const client = ModelClient(endpoint, new AzureKeyCredential(token!));

    const response = await client.path('/chat/completions').post({
      body: {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        temperature: 0.8,
        top_p: 1,
        model,
      },
    });

    if (isUnexpected(response)) throw response.body.error;

    return response.body.choices[0].message.content;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: formatTime(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendMessageToAzure(newMessages);
      const assistantMsg: Message = {
        role: 'assistant',
        content: reply.replace(/\\n/g, '\n').trim(),
        timestamp: formatTime(),
      };
      setMessages([...newMessages, assistantMsg]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again later.',
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.floatingButtonText}>💬</Text>
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health AI Chatbot</Text>
          <TouchableOpacity onPress={() => setIsOpen(false)}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messages} contentContainerStyle={{ paddingBottom: 20 }}>
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.message,
                msg.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text>{msg.content}</Text>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.typing}>
              <ActivityIndicator size="small" color="#6B7280" />
              <Text style={{ marginLeft: 6 }}>Typing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask me something..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default HealthChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  closeText: {
    fontSize: 18,
    color: '#1E3A8A',
  },
  messages: {
    maxHeight: 350,
  },
  message: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#DBEAFE',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    padding: 16,
    elevation: 4,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
